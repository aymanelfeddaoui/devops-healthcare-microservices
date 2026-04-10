export default function DoctorServiceFactory ({ config, loadService, logger }) {
  const { doctorService: doctorServiceConfig } = config.services
  const target = process.env.DOCTOR_SERVICE_TARGET?.trim(); // supprime \r et espaces
  const client = new DoctorService(target, grpc.credentials.createInsecure());


  const DoctorService = loadService({
    serviceName: 'DoctorService',
    fileName: 'doctor',
    address: `${doctorServiceConfig.host}:${doctorServiceConfig.port}`,
  })

  logger.info({
    message: 'DoctorService loaded',
  })

  return DoctorService
}
