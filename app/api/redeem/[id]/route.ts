const sdk = require("api")("@verbwire/v1.0#17j7q2eliomvi56")
import { NextResponse } from "next/server"

export async function GET(request:any, context: { params: { id: string } }) {
  const id = context.params.id;
  try {
    console.log(process.env.VERBWIRE);
    sdk.auth(process.env.VERBWIRE);
    const response = await sdk.postNftMintQuickmintfrommetadata({
      chain: 'goerli',
         recipientAddress: id,
      name: 'Achieve500',
      data: '[{"trait_type":"Words","value":"500"}]',
      description: 'Received for writing at least 500 words'
    }, { accept: 'application/json' });
    
    console.log(response.data);
    return NextResponse.json({ message: "Redeemed!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error!" });
  }
}