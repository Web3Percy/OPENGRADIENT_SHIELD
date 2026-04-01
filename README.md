# OpenGradient Shield

OpenGradient Shield is a decentralized AI Token Security Auditor built to analyze Ethereum smart contracts. It leverages the OpenGradient Python SDK to perform comprehensive "Rug Checks" directly on the source code, surfacing potential honeypots, malicious minting functions, and liquidity risks before users interact with a contract.

## Tech Stack

*   **Backend:** FastAPI (Python), Web3.py (address validation), OpenGradient SDK (Verifiable AI Inference), HTTPX (Etherscan fetching).
*   **Frontend:** React (Next.js/Vite), Tailwind CSS, Framer Motion, Lucide React.

## Features

*   **Verifiable AI:** Uses `Meta-Llama-3-8B-Instruct` deployed on OpenGradient's decentralized AI infrastructure to evaluate smart contract code.
*   **Security Score:** Returns an AI-generated score from 0-100 indicating the safety of a contract.
*   **Risk Flags:** Highlights specific vulnerabilities such as honeypot mechanisms, unverified source code, or centralized control risks.

## Setup

### Backend
1. Navigate to `/backend`.
2. Install dependencies: `pip install -r requirements.txt` or use `pip install .` / `uv run`.
3. Create a `.env` file and set `OG_PRIVATE_KEY` and `ETHERSCAN_API_KEY`.
4. Run: `uvicorn main:app --port 8000`

### Frontend
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Run: `npm run dev`.