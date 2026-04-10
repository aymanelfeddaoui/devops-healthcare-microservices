import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';

const client = new grpc.Client();
client.load(['.'], 'doctor.proto');

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '2m', target: 100 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  client.connect('127.0.0.1:50051', { plaintext: true });

  const data = { id: '12345', payload: 'Test' };
  const response = client.invoke('DoctorService/GetDoctor', data);

  // --- LE MOUCHARD ---
  if (response.status !== grpc.StatusOK) {
      console.log(`\n🚨 ERREUR REÇUE DU BACKEND : ${JSON.stringify(response.error)}\n`);
  }
  // -------------------

  check(response, {
    'Statut gRPC est OK (0)': (r) => r && r.status === grpc.StatusOK,
  });

  client.close();
  sleep(1);
}