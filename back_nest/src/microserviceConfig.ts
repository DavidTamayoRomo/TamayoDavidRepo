import {KafkaOptions, Transport} from "@nestjs/microservices";

export const microserviceConfig: KafkaOptions = {
    transport: Transport.KAFKA,

    options: {
        client: {
            brokers: [`localhost:9091`],
        },
        consumer: {
            groupId: '1',
            allowAutoTopicCreation: true,
        },
    }
};