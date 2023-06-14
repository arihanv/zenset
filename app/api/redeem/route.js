const sdk = require("api")("@verbwire/v1.0#17j7q2eliomvi56")
import { NextResponse } from "next/server"
export async function GET() {
  return NextResponse.json({ message: "Hello from the server!" })
  // try {
  //   console.log(process.env.VERBWIRE);
  //   sdk.auth(process.env.VERBWIRE);
  //   const response = await sdk.postNftMintQuickmintfrommetadata({
  //     chain: 'goerli',
  //     name: 'Achieve500',
  //     data: '[{"trait_type":"Words","value":"500"}]',
  //     description: 'Received for writing at least 500 words'
  //   }, { accept: 'application/json' });
    
  //   console.log(response.data);
  //   return NextResponse.json(response.data); // Return the response data
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json(null); // Return null or any default value in case of an error
  // }
}