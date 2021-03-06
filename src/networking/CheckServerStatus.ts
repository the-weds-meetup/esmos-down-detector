import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

interface dataProps {
  nginx: {
    isAlive: boolean;
    code?: string;
  };
  cat: {
    isAlive: boolean;
    code?: string;
  };
  osticket: {
    isAlive: boolean;
    code?: string;
  };
  pulse: {
    isAlive: boolean;
    code?: string;
  };
}

const CheckServerStatus = async (): Promise<dataProps> => {
  const serverURL = process.env.SERVER_URL;
  const catSystem = ':8000';
  const pulse = ':8001/testpoint';
  const agent = new https.Agent({ rejectUnauthorized: false });

  const isNginxAlive = await axios
    .get(`http://${serverURL}`, { timeout: 10000 })
    .then(() => {
      return { isAlive: true };
    })
    .catch((error: AxiosError) => {
      console.log('---NGINX---');
      console.log(`${error.name}: ${error.code}`);
      console.log('[MSG]', error.message);
      return { isAlive: false, code: error.code };
    });

  const isCatAlive = await axios
    .get(`http://${serverURL}${catSystem}`, { timeout: 10000 })
    .then(() => {
      return { isAlive: true };
    })
    .catch((error: AxiosError) => {
      console.log('---CAT---');
      console.log(`${error.name}: ${error.code}`);
      console.log('[MSG]', error.message);
      return { isAlive: false, code: error.code };
    });

  const isOSTicketAlive = await axios
    .get(`https://${serverURL}`, { timeout: 10000, httpsAgent: agent })
    .then(() => {
      return { isAlive: true };
    })
    .catch((error: AxiosError) => {
      console.log('---Ticketing---');
      console.log(`${error.name}: ${error.code}`);
      console.log('[MSG]', error.message);
      return { isAlive: false, code: error.code };
    });

  const isPulseAlive = await axios
    .get(`http://${serverURL}${pulse}`, {
      timeout: 10000,
    })
    .then(() => {
      return { isAlive: true };
    })
    .catch((error: AxiosError) => {
      console.log('---Pulse---');
      console.log(`${error.name} [${error.code}]`);
      console.log('[MSG]', error.message);
      return { isAlive: false, code: error.code };
    });

  return {
    nginx: isNginxAlive,
    cat: isCatAlive,
    osticket: isOSTicketAlive,
    pulse: isPulseAlive,
  };
};

export default CheckServerStatus;
