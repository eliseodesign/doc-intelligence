import axios from 'axios';


const endpoint = 'https://production-hazconta.cognitiveservices.azure.com/';
const apiKey = 'd289458d75d24d8d98b65fb1347f90e6';

export async function analyzeDocument(urlSource) {
  try {
    const response = await axios.post(`${endpoint}/formrecognizer/documentModels/prebuilt-document:analyze?api-version=2023-07-31`, {
      urlSource
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey
      }
    });

    console.log('response', response); 

    const resultId = response.headers['operation-location'].split('/').pop();
    console.log("resultId", resultId); 
    // const analyzeResult = await getAnalyzeResult(resultId);

    return resultId;
  } catch (err) {
    throw err;
  }
}

async function getAnalyzeResult(resultId) {
  try {
    let analyzeResult = null;
    let status = null;

    do {
      const response = await axios.get(`${endpoint}/formrecognizer/documentModels/prebuilt-document/analyzeResults/${resultId}?api-version=2023-07-31`, {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        }
      });

      analyzeResult = response.data.analyzeResult;
      status = response.data.status;

      if (status === 'notStarted' || status === 'running') {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } while (status === 'notStarted' || status === 'running');

    return analyzeResult;
  } catch (err) {
    throw err;
  }
}
