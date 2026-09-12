import os
import streamlit as st
from dotenv import load_dotenv
from openai import OpenAI, AuthenticationError, RateLimitError, APIError


# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="LogiLLM Control Tower",
    page_icon="🚚",
    layout="wide",
    initial_sidebar_state="expanded"
)


# ============================================================
# CUSTOM CSS
# Only used for general styling — no HTML interface components
# ============================================================

st.markdown(
    """
    <style>

    #MainMenu {
        visibility: hidden;
    }

    footer {
        visibility: hidden;
    }

    header {
        visibility: hidden;
    }

    .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 1500px;
    }

    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.2rem;
    }

    .main-subtitle {
        color: #6b7280;
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
    }

    .section-title {
        font-size: 1.15rem;
        font-weight: 650;
        margin-top: 1.5rem;
        margin-bottom: 0.8rem;
    }

    .footer-text {
        text-align: center;
        color: #9ca3af;
        font-size: 0.72rem;
        padding-top: 30px;
    }

    </style>
    """,
    unsafe_allow_html=True
)


# ============================================================
# OPENAI API CONFIGURATION
# ============================================================

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

# Streamlit Cloud fallback
if not api_key and "OPENAI_API_KEY" in st.secrets:
    api_key = st.secrets["OPENAI_API_KEY"]

client = None

if api_key:
    client = OpenAI(api_key=api_key)


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:

    st.title("🚚 LogiLLM")

    st.caption("CONTROL TOWER")

    st.divider()

    navigation = st.radio(
        "Navigation",
        [
            "Overview",
            "Shipment Planning",
            "Risk & Exceptions",
            "Sustainability",
            "AI Decision Support"
        ]
    )

    st.divider()

    st.caption("OPERATIONS")

    st.write("Global logistics visibility")
    st.write("Decision support")
    st.write("Exception monitoring")


# ============================================================
# MAIN HEADER
# ============================================================

header_col1, header_col2 = st.columns([5, 1])

with header_col1:

    st.markdown(
        '<div class="main-title">LogiLLM Control Tower</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="main-subtitle">'
        'Logistics planning, operational visibility and decision support'
        '</div>',
        unsafe_allow_html=True
    )

with header_col2:

    st.success("CONTROL TOWER ONLINE")


# ============================================================
# OVERVIEW
# ============================================================

if navigation == "Overview":

    st.markdown(
        '<div class="section-title">Network Overview</div>',
        unsafe_allow_html=True
    )

    # --------------------------------------------------------
    # KPI CARDS
    # --------------------------------------------------------

    col1, col2, col3, col4, col5 = st.columns(5)

    with col1:
        st.metric(
            "Active Shipments",
            "128",
            "8.4%"
        )

    with col2:
        st.metric(
            "On-Time Delivery",
            "94.2%",
            "1.8%"
        )

    with col3:
        st.metric(
            "Avg. Lead Time",
            "2.4d",
            "-0.3d"
        )

    with col4:
        st.metric(
            "At-Risk Shipments",
            "11",
            "Requires attention"
        )

    with col5:
        st.metric(
            "Open Exceptions",
            "7",
            "3 high priority"
        )


    # --------------------------------------------------------
    # RECENT SHIPMENT ACTIVITY
    # --------------------------------------------------------

    st.markdown(
        '<div class="section-title">Recent Shipment Activity</div>',
        unsafe_allow_html=True
    )

    activities = [
        {
            "id": "SHP-10482",
            "route": "Frankfurt → Accra",
            "status": "In Transit · On Schedule",
            "type": "success"
        },
        {
            "id": "SHP-10479",
            "route": "Shanghai → Hamburg",
            "status": "Delivery Risk",
            "type": "warning"
        },
        {
            "id": "SHP-10476",
            "route": "Amsterdam → Frankfurt",
            "status": "Delivered",
            "type": "success"
        },
        {
            "id": "SHP-10471",
            "route": "Dubai → Accra",
            "status": "Exception",
            "type": "error"
        },
        {
            "id": "SHP-10469",
            "route": "Rotterdam → Kumasi",
            "status": "In Transit",
            "type": "success"
        }
    ]

    for activity in activities:

        with st.container(border=True):

            col1, col2, col3 = st.columns([1, 3, 2])

            with col1:
                st.write(f"**{activity['id']}**")

            with col2:
                st.write(activity["route"])

            with col3:

                if activity["type"] == "success":
                    st.success(activity["status"])

                elif activity["type"] == "warning":
                    st.warning(activity["status"])

                else:
                    st.error(activity["status"])


    # --------------------------------------------------------
    # NETWORK PERFORMANCE
    # --------------------------------------------------------

    st.markdown(
        '<div class="section-title">Network Performance</div>',
        unsafe_allow_html=True
    )

    performance_col1, performance_col2 = st.columns([1.5, 1])

    with performance_col1:

        with st.container(border=True):

            st.write("### Transport Utilisation")

            st.write("Air Freight — 78%")
            st.progress(0.78)

            st.write("Ocean Freight — 64%")
            st.progress(0.64)

            st.write("Road Freight — 86%")
            st.progress(0.86)

            st.write("Rail Freight — 52%")
            st.progress(0.52)


    # --------------------------------------------------------
    # OPERATIONAL PULSE
    # --------------------------------------------------------

    with performance_col2:

        with st.container(border=True):

            st.write("### Operational Pulse")

            st.caption("NETWORK INSIGHT")

            st.write(
                "Overall network performance remains stable. "
                "The primary concentration of operational risk is "
                "currently within Asia–Europe ocean lanes and selected "
                "Africa-bound shipments."
            )

            st.warning(
                "Priority: monitor delayed departures and upcoming "
                "delivery-window breaches."
            )


# ============================================================
# SHIPMENT PLANNING
# ============================================================

elif navigation == "Shipment Planning":

    st.markdown(
        '<div class="section-title">Shipment Planning</div>',
        unsafe_allow_html=True
    )

    st.write(
        "Configure shipment parameters to generate a logistics recommendation."
    )

    planning_col1, planning_col2 = st.columns(2)

    with planning_col1:

        origin = st.text_input(
            "Origin",
            placeholder="e.g. Frankfurt"
        )

        destination = st.text_input(
            "Destination",
            placeholder="e.g. Accra"
        )

        cargo_type = st.selectbox(
            "Cargo Type",
            [
                "General Cargo",
                "Electronics",
                "Pharmaceuticals",
                "Automotive Parts",
                "Food & Perishables",
                "Industrial Equipment"
            ]
        )

        weight = st.number_input(
            "Cargo Weight (kg)",
            min_value=1.0,
            value=1000.0
        )

        cargo_value = st.number_input(
            "Cargo Value (€)",
            min_value=0.0,
            value=10000.0
        )

    with planning_col2:

        urgency = st.selectbox(
            "Urgency",
            [
                "Standard",
                "High",
                "Critical"
            ]
        )

        business_priority = st.selectbox(
            "Business Priority",
            [
                "Cost Optimisation",
                "Balanced",
                "Speed / Service"
            ]
        )

        delivery_window = st.selectbox(
            "Delivery Window",
            [
                "Flexible",
                "Within 7 days",
                "Within 3 days",
                "Within 24 hours"
            ]
        )

        preferred_mode = st.selectbox(
            "Preferred Transport Mode",
            [
                "No Preference",
                "Air",
                "Ocean",
                "Road",
                "Rail"
            ]
        )

    st.divider()

    generate = st.button(
        "Generate Logistics Recommendation",
        type="primary",
        use_container_width=True
    )

    if generate:

        if not origin or not destination:

            st.warning(
                "Please enter both an origin and destination."
            )

        elif client is None:

            st.error(
                "The AI service is not configured. "
                "Please check the application's API configuration."
            )

        else:

            prompt = f"""
You are a professional logistics planning analyst.

Analyse the following shipment:

Origin: {origin}
Destination: {destination}
Cargo type: {cargo_type}
Weight: {weight} kg
Cargo value: €{cargo_value}
Urgency: {urgency}
Business priority: {business_priority}
Delivery window: {delivery_window}
Preferred mode: {preferred_mode}

Provide:

1. Recommended transport mode
2. Reasoning
3. Cost considerations
4. Speed considerations
5. Operational risks
6. Sustainability considerations
7. Recommended action

Keep the response concise and suitable for a logistics manager.
"""

            try:

                with st.spinner(
                    "Analysing shipment and evaluating logistics options..."
                ):

                    response = client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[
                            {
                                "role": "system",
                                "content": (
                                    "You are an experienced logistics "
                                    "and supply chain planning analyst."
                                )
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        temperature=0.3
                    )

                result = response.choices[0].message.content

                st.success("Recommendation generated")

                st.markdown("### Logistics Recommendation")

                st.write(result)

            except AuthenticationError:

                st.error(
                    "The logistics recommendation service could not "
                    "authenticate with the AI provider. Please check "
                    "the application's API configuration."
                )

            except RateLimitError:

                st.warning(
                    "The AI service is temporarily unavailable because "
                    "the API usage limit has been reached."
                )

            except APIError:

                st.error(
                    "The AI logistics service returned an API error. "
                    "Please try again later."
                )

            except Exception as e:

                st.error(
                    f"An unexpected error occurred: {e}"
                )


# ============================================================
# RISK & EXCEPTIONS
# ============================================================

elif navigation == "Risk & Exceptions":

    st.markdown(
        '<div class="section-title">Risk & Exceptions</div>',
        unsafe_allow_html=True
    )

    st.write(
        "Illustrative operational exceptions requiring monitoring "
        "or intervention."
    )

    risks = [
        (
            "SHP-10479",
            "Shanghai → Hamburg",
            "Port congestion",
            "Medium"
        ),
        (
            "SHP-10471",
            "Dubai → Accra",
            "Documentation exception",
            "High"
        ),
        (
            "SHP-10465",
            "Singapore → Frankfurt",
            "Weather disruption",
            "Medium"
        ),
        (
            "SHP-10458",
            "Accra → Amsterdam",
            "Capacity constraint",
            "High"
        )
    ]

    for shipment_id, route, issue, level in risks:

        with st.container(border=True):

            col1, col2, col3 = st.columns([1, 3, 1])

            with col1:
                st.write(f"**{shipment_id}**")

            with col2:
                st.write(f"{route} · {issue}")

            with col3:

                if level == "High":
                    st.error(level)

                else:
                    st.warning(level)


    st.markdown(
        '<div class="section-title">Exception Priorities</div>',
        unsafe_allow_html=True
    )

    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric(
            "High Priority",
            "3",
            "Requires intervention"
        )

    with col2:
        st.metric(
            "Medium Priority",
            "4",
            "Monitor closely"
        )

    with col3:
        st.metric(
            "Resolved Today",
            "6",
            "12%"
        )


# ============================================================
# SUSTAINABILITY
# ============================================================

elif navigation == "Sustainability":

    st.markdown(
        '<div class="section-title">Sustainability Overview</div>',
        unsafe_allow_html=True
    )

    st.write(
        "Illustrative sustainability indicators for the logistics network."
    )

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric(
            "Estimated CO₂ / Shipment",
            "186 kg",
            "-8.4%"
        )

    with col2:
        st.metric(
            "Lower-Emission Modes",
            "42%",
            "6.2%"
        )

    with col3:
        st.metric(
            "Route Efficiency",
            "91%",
            "3.1%"
        )

    with col4:
        st.metric(
            "Consolidated Loads",
            "68%",
            "9.5%"
        )

    st.markdown(
        '<div class="section-title">Sustainability Priorities</div>',
        unsafe_allow_html=True
    )

    with st.container(border=True):

        st.caption("NETWORK DIRECTION")

        st.write(
            "Increase shipment consolidation, improve route utilisation, "
            "and selectively shift suitable freight toward lower-emission "
            "transport modes without compromising critical delivery "
            "requirements."
        )


# ============================================================
# AI DECISION SUPPORT
# ============================================================

elif navigation == "AI Decision Support":

    st.markdown(
        '<div class="section-title">AI Decision Support</div>',
        unsafe_allow_html=True
    )

    st.write(
        "Decision-support layer designed to assist logistics planners "
        "with shipment-level recommendations."
    )

    col1, col2, col3 = st.columns(3)

    with col1:

        with st.container(border=True):

            st.caption("PLANNING")

            st.metric(
                "Shipments Monitored",
                "128"
            )

    with col2:

        with st.container(border=True):

            st.caption("RISK")

            st.metric(
                "Shipments Requiring Attention",
                "11"
            )

    with col3:

        with st.container(border=True):

            st.caption("EXCEPTIONS")

            st.metric(
                "Active Operational Issues",
                "7"
            )


    st.markdown(
        '<div class="section-title">Decision Workflow</div>',
        unsafe_allow_html=True
    )

    workflow = [
        ("01", "Shipment Data", "Input"),
        ("02", "Operational Analysis", "Processing"),
        ("03", "Risk Assessment", "Evaluation"),
        ("04", "Recommendation", "Decision Support"),
        ("05", "Human Decision", "Execution")
    ]

    for number, stage, description in workflow:

        with st.container(border=True):

            col1, col2, col3 = st.columns([0.5, 3, 1])

            with col1:
                st.write(f"**{number}**")

            with col2:
                st.write(f"**{stage}**")

            with col3:
                st.caption(description)


    st.markdown(
        '<div class="section-title">Design Principle</div>',
        unsafe_allow_html=True
    )

    with st.container(border=True):

        st.write(
            "LogiLLM is designed as a decision-support layer rather "
            "than a replacement for human logistics planners. "
            "Recommendations should be reviewed against operational "
            "constraints before execution."
        )


# ============================================================
# FOOTER
# ============================================================

st.markdown(
    '<div class="footer-text">'
    'LogiLLM Control Tower · Logistics Decision Support Prototype<br>'
    'Illustrative analytics for demonstration purposes'
    '</div>',
    unsafe_allow_html=True
)