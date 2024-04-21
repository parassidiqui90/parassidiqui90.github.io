import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.express as px
import pandas as pd

# Load and prepare your data
df = pd.read_excel("UL_FEB23_MAR24_UPDATE_2.xlsx")  # Make sure to put the correct file path here

# Convert 'Amount' column to numeric, coercing any errors to NaN
df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')

# Drop any rows that now have NaN in the 'Amount' column, if any
df = df.dropna(subset=['Amount'])

# Ensure 'Date' column is in datetime format
df['Date'] = pd.to_datetime(df['Date'], errors='coerce')

# Initialize the Dash app
app = dash.Dash(__name__)

# App layout
app.layout = html.Div([
    html.Div([
        html.H1("Express Flights - Sales Analysis", style={'color': 'black', 'textAlign': 'center', 'font-size': '36px'}),
        html.P("This plot provides a sales chart of various airlines' PNRs over the year from 2023 to 2024.",
            style={'color': 'black', 'textAlign': 'center', 'margin-bottom': '40px'})
    ], style={'backgroundColor': 'yellow', 'padding': '10px', 'border-radius': '5px'}),
    
    html.Div([
        html.Label("Select Airline Code:"),
        dcc.Dropdown(
            id='airline-code-dropdown',
            options=[
                {'label': 'UL - SriLankan Airlines', 'value': 'UL'},
                {'label': 'QR - Qatar Airways', 'value': 'QR'},
                {'label': 'EY - Etihad Airways', 'value': 'EY'},
                {'label': 'TG - Thai Airways', 'value': 'TG'},
                {'label': 'EK - Emirates', 'value': 'EK'},
                {'label': 'CZ - China Southern', 'value': 'CZ'}  # Added 'CZ' option
            ],
            value=['UL'],  # Default value to a list for multiple selections
            multi=True,  # Enable multi-selection
            clearable=False
        ),
        html.Label("Select Aggregation Level:", style={'marginTop': '20px'}),
        dcc.Dropdown(
            id='aggregation-level-dropdown',
            options=[
                {'label': 'Daily', 'value': 'D'},
                {'label': 'Weekly', 'value': 'W'},
                {'label': 'Monthly', 'value': 'M'},
                {'label': 'Quarterly', 'value': 'Q'}
            ],
            value='M',  # Default value
            clearable=False
        )
    ], style={'padding': '20px'}),
    
    dcc.Graph(id='sales-analysis-chart')
], style={'backgroundColor': '#FFF89A'})  # Set the background color to a light yellow

# Callback to update the chart based on the selected airlines and aggregation level
@app.callback(
    Output('sales-analysis-chart', 'figure'),
    [Input('airline-code-dropdown', 'value'),
     Input('aggregation-level-dropdown', 'value')]
)
def update_chart(airline_codes, aggregation_level):
    # Initialize an empty DataFrame for the combined sales data
    combined_sales_data = pd.DataFrame()

    for airline_code in airline_codes:
        # Filter for PNRs starting with the current airline code in the loop
        df_filtered = df[df['PNR'].str.startswith(airline_code)]

        # Filter for the specified date range
        start_date = '2023-02-01'
        end_date = '2024-03-31'
        mask = (df_filtered['Date'] >= start_date) & (df_filtered['Date'] <= end_date)
        df_filtered = df_filtered.loc[mask]

        # Resample and sum the Amounts based on the selected aggregation level
        df_filtered.set_index('Date', inplace=True)
        sales_summary = df_filtered.resample(aggregation_level)['Amount'].sum()

        # Apply multiplication factors for the specified airlines
        factor = {
            'EY': 1.4,  # Example factor, replace with actual if different
            'EK': 1.5,
            'QR': 1.5,
            'TG': 1.3,
            # Add any additional airline multiplication factors here
        }.get(airline_code, 1)  # Default to 1 if not specified
        sales_summary *= factor

        # Convert to DataFrame and name the columns
        sales_summary_df = sales_summary.reset_index(name='Amount')
        sales_summary_df['Airline'] = airline_code

        # Append the results to the combined DataFrame
        combined_sales_data = pd.concat([combined_sales_data, sales_summary_df])

    # Create the Plotly Express bar chart
    fig = px.bar(
        combined_sales_data,
        x='Date',
        y='Amount',
        color='Airline',
        title=f"Sales Comparison by Airline Aggregated by {aggregation_level}",
        barmode='group'
    )

    # Update plot layout
    fig.update_layout(
        xaxis_title="Date",
        yaxis_title="Sales Amount",
        plot_bgcolor='white',
        paper_bgcolor='rgba(0,0,0,0)'
    )
    
    return fig

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)
