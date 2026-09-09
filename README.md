# 🚚 LogiLLM Control Tower

> **Learning prototype:** An early exploration of how AI can support supply-chain and logistics decision-making by connecting operational data, planning considerations and intelligent recommendations in one workflow.

🌐 Live Demo: [View Here](https://logillm-logistics-planning-assistant.streamlit.app/)

![Application Image Demo](Prompt.png)

## Why I Built It

At the time of developing this project, I was beginning to explore the relationship between data analytics, artificial intelligence and logistics.

The project was primarily an experiment in applying an emerging technical skill to a logistics-related context rather than a production-ready logistics decision-support system.

## What the Prototype Does

The application accepts basic shipment information and uses an LLM to generate a proposed logistics plan.

The prototype explores ideas such as:

- Transport-mode selection
- Shipment considerations
- Cost and time trade-offs
- Basic logistics planning recommendations

## What I Learned

The project helped me understand how an LLM-based interface could be connected to a business-oriented use case.

It also exposed an important limitation in my early approach: applying technology to a domain is not the same as understanding the operational problem deeply enough to design an effective solution.

As my understanding of supply chains and logistics develops, I am interested in revisiting this type of idea from a stronger operational and problem-solving perspective.

## Features

- 🚛 Transport mode recommendations (Road, Rail, Air, Sea)
- 💰 Cost vs. speed trade-off analysis
- ⚠️ Shipment risk assessment
- 🌱 Sustainability insights
- 📊 Executive logistics summaries
- 🤖 AI-powered decision support

## Tech Stack

- Python
- Streamlit
- OpenAI API
- python-dotenv

### AI Recommendation Output

![AI Recommendation](Response.png)

## Run Locally

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_api_key_here
```

Start the application:

```bash
streamlit run logistics_ai_assistant.py
```

## Current Version

**MVP (Minimum Viable Product)**

The current release focuses on AI-assisted shipment planning, transportation mode recommendations, operational risk assessment, and sustainability guidance.

## Roadmap

### Version 2
- Shipment database integration (SQLite)
- Order creation and management
- Shipment status tracking
- Historical shipment records

### Version 3
- Logistics KPI dashboards
- CSV shipment uploads
- Delay prediction models
- AI-powered supply chain analytics
- Business intelligence reporting

## Business Value

This project demonstrates how Large Language Models (LLMs) can support logistics planning and transportation decision-making by providing fast, data-driven recommendations for supply chain operations.

## Author

**Selasey Dick Junior Gbeddy**

Supply Chain Analytics | Logistics Technology | AI Applications in Operations

