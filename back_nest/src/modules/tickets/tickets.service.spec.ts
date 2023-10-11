import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { StateService } from '../../services/state/state.service';
import { RepositoryStateFakeEnum } from '../../constants/RepositoryEnums';
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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: getRepositoryToken(Ticket), useValue: mockRepository },
        { provide: StateService, useValue: mockStateService },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });
  it('valid service',()=>{
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a ticket and emit a message to Kafka', async () => {
      const input = { 
        "category": "incident",
        "status": "rejected",
        "priority": "high",
        "title": "Titulo 7",
        "description": "Esta es la descripcion 7",
        "createdAt": new Date(),
        "updatedAt": new Date()
       };
      const savedTicket = { ...input, id: '1' };
      //mockRepository.create.mockReturnValueOnce(input);
      mockRepository.save.mockResolvedValueOnce(savedTicket);
      mockStateService.getStatusCodeById.mockResolvedValueOnce({id:'0485a743-cc27-48b1-a483-fa182c079c2d', state: '606' });
  
      const result = await service.create(input);
  
      expect(result).toEqual(savedTicket);
     
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledWith(input);
      expect(mockStateService.getStatusCodeById).toBeCalledTimes(1);
      expect(mockStateService.getStatusCodeById).toBeCalledWith(RepositoryStateFakeEnum.rejected);
      expect(mockStateService.getStatusCodeById).not.toBeCalledWith(RepositoryStateFakeEnum.approved);
      /* expect(mockClientKafka.emit).toHaveBeenCalledWith(
        'technical_support_tickets',
        JSON.stringify({ id: savedTicket.id, status: 'some-state' }),
      );  */
    });
  });


});
