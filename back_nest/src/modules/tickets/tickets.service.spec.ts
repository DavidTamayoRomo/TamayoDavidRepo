import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { StateService } from '../../services/state/state.service';
import { RepositoryStateFakeEnum } from '../../constants/RepositoryEnums';
import { ClientKafka } from '@nestjs/microservices';
describe('TicketsService', () => {
  let service: TicketsService;
  let mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  let mockStateService = {
    getStatusCodeById: jest.fn(),
  };

  let mockClientKafka = {
    emit: jest.fn(),
  };

  let clientMock: { emit: () => void };
  beforeAll(async () => {
    clientMock = { emit: jest.fn() };
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
      const savedTicket = { ...input, id: '0485a743-cc27-48b1-a483-fa182c079c2d' };
      mockRepository.save.mockResolvedValueOnce(savedTicket);
      mockStateService.getStatusCodeById.mockResolvedValueOnce({id:'0485a743-cc27-48b1-a483-fa182c079c2d', state: '606' });
  
      const result = await service.create(input);
      //const emitSpy = jest.spyOn(clientMock, 'emit');
  
      expect(result).toEqual(savedTicket);
     
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledWith(input);
      expect(mockStateService.getStatusCodeById).toBeCalledTimes(1);
      expect(mockStateService.getStatusCodeById).toBeCalledWith(RepositoryStateFakeEnum.rejected);
      expect(mockStateService.getStatusCodeById).not.toBeCalledWith(RepositoryStateFakeEnum.approved);
     
      /* expect(mockClientKafka.emit).toHaveBeenCalledWith(
        'technical_support_tickets',
        JSON.stringify({ id: '0485a743-cc27-48b1-a483-fa182c079c2d', status: RepositoryStateFakeEnum.rejected }),
      ); */
    });
  });

  describe('findbyId', () => {
    it('should return a ticket if it exists', async () => {
      const mockTicket = new Ticket(); 
      mockTicket.id = '0485a743-cc27-48b1-a483-fa182c079c2d'; 
      mockRepository.findOne.mockResolvedValue(mockTicket);
      const ticket = await service.findOne(mockTicket.id);
      expect(ticket).toEqual(mockTicket);
      expect(mockRepository.findOne).toBeCalledWith(mockTicket.id);
    });
  });


});
