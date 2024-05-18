import { Router } from 'express';
import DocumentIntelligence, { getLongRunningPoller, isUnexpected } from "@azure-rest/ai-document-intelligence";
import * as dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
}
);

router.post('/extract-text', async (req, res) => {
  try {
    const endpoint = process.env.DOCUMENT_INTELLIGENCE_ENDPOINT ?? "<document intelligence endpoint>";
    const apiKey = process.env.DOCUMENT_INTELLIGENCE_API_KEY ?? "<api key>";

    // const urlSource = req.body.urlSource;
    // if (!urlSource || typeof urlSource !== 'string' || urlSource.trim() === '') {
    //   throw new Error("Expected urlSource in request body as a non-empty string.");
    // }
    

    const client = DocumentIntelligence(endpoint, { key: apiKey });
    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", "prebuilt-document")
      .post({
        contentType: "application/json",
        body: {
          urlSource: "https://raw.githubusercontent.com/Azure/azure-sdk-for-js/main/sdk/formrecognizer/ai-form-recognizer/assets/invoice/sample_invoice.jpg"
        }
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }
    const poller = await getLongRunningPoller(client, initialResponse);
    const analyzeResult = (
      (await (poller).pollUntilDone()).body
    ).analyzeResult;


    res.status(200).json(analyzeResult);
  } catch (err) {
    console.error("The sample encountered an error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
