# Agent Guidelines: Verifiable AI Features of OpenGradient

When working on or extending **OpenGradient Shield**, agents and developers must understand the role of OpenGradient.

## Verifiable Decentralized AI
OpenGradient is used to bring verifiable AI inference on-chain and into decentralized applications. 

*   **Inference as a Service:** We use `og.llm_completion()` from the `opengradient` Python SDK to run inferences securely.
*   **Model Choice:** For token security auditing, we currently use the `meta-llama/Meta-Llama-3-8B-Instruct` model. This model is capable of understanding typical Solidity code patterns and identifying common smart contract risks (Reentrancy, Honeypots, excessive Minting functions, etc.).
*   **Verifiability:** Because the inference runs on OpenGradient's infrastructure, the result can be cryptographically verified, ensuring the security audit wasn't tampered with by a centralized intermediary.

## Adding Features
If adding new features that require AI analysis (e.g., wallet behavioral analysis, or multi-chain contract analysis):
1. Always route the analysis through the `opengradient` SDK.
2. Structure prompts strictly to request JSON outputs, enabling seamless parsing on the backend.
3. Provide robust fallback simulated responses if the `OG_PRIVATE_KEY` is missing to ensure a smooth developer experience in local environments.