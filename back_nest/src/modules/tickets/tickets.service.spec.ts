import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { StateService } from '../../services/state/state.service';
import { ClientKafka } from '@nestjs/microservices';
describe('TicketsService', () => {
  let service: TicketsService;
  let mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  let mockStateService = {
    getStatusCodeById: jest.fn(),
  };

  let mockClientKafka = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: getRepositoryToken(Ticket), useValue: mockRepository },
        { provide: StateService, useValue: mockStateService },
        { provide: ClientKafka, useValue: mockClientKafka },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  describe('create', () => {
    it('should create a ticket and emit a message to Kafka', async () => {
      const input = { 
        "category": "incident",
        "status": "APROBADO",
        "priority": "high",
        "title": "Titulo 7",
        "description": "Esta es la descripcion 7",
        "createdAt": new Date(),
        "updatedAt": new Date()
       };
      const savedTicket = { ...input, id: '1' };
      mockRepository.create.mockReturnValueOnce(input);
      mockRepository.save.mockResolvedValueOnce(savedTicket);
      mockStateService.getStatusCodeById.mockReturnValueOnce({
        subscribe: jest.fn((fn) => fn({ data: { state: 'some-state' } })),
      });
  
      const result = await service.create(input);
  
      expect(result).toEqual(savedTicket);
      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(mockRepository.save).toHaveBeenCalledWith(input);
      expect(mockStateService.getStatusCodeById).toHaveBeenCalledWith(/* ... expected args ... */);
      expect(mockClientKafka.emit).toHaveBeenCalledWith(
        'technical_support_tickets',
        JSON.stringify({ id: savedTicket.id, status: 'some-state' }),
      );
    });
  });


});
