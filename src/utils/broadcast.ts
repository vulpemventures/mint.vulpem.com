import axios from "axios";
import { BLOCKSTREAM_ESPLORA_ENDPOINT } from "ldk";

export async function broadcastTransaction(net: 'liquid' | 'regtest', hex: string): Promise<string> {
  let url = `http://localhost:3001`;
  if (net === 'liquid') {
    url = BLOCKSTREAM_ESPLORA_ENDPOINT
  }

  try {
    return (await axios.post(`${url}/tx`, hex)).data as string;
  } catch (err) {
    console.error(err);
    throw err;
  }
}