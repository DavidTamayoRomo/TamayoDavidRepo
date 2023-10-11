import { Test, TestingModule } from "@nestjs/testing";
import { TicketsController } from "./tickets.controller"
import { TicketsService } from "./tickets.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Ticket } from "./entities/ticket.entity";
import { StateService } from "../../services/state/state.service";

describe('TicketsController', () => {
    let ticketController: TicketsController;
    let service: TicketsService;
    //mocks
    const mockTicketRepository = {};
    const mockStateService = {};
    const mockTicketsService = {
        create: jest.fn(),
    };
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TicketsController],
            providers: [
                {
                    provide: TicketsService,
                    useValue: mockTicketsService,
                },
                {
                    provide: getRepositoryToken(Ticket),
                    useValue: mockTicketRepository,
                },
                {
                    provide: StateService,
                    useValue: mockStateService,
                },
            ]
        }).compile();

        ticketController = module.get<TicketsController>(TicketsController);
        service = module.get<TicketsService>(TicketsService);
    });


    it('valid controller', () => {
        expect(ticketController).toBeDefined()
    })


    /* async create(@Body() createTicketInput: CreateTicketInput): Promise<Ticket> {
        return await this.ticketsService.create(createTicketInput);
    } */
    describe('create', () => {
        it('should create a ticket ', async () => {
            const input = {
                "category": "incident",
                "status": "rejected",
                "priority": "high",
                "title": "Titulo 7",
                "description": "Esta es la descripcion 7",
                "createdAt": new Date(),
                "updatedAt": new Date()
            };
            const resultTicket = new Ticket();
            mockTicketsService.create.mockResolvedValue(resultTicket);
            const result = await ticketController.create(input);
            // Verificamos que el método 'create' del servicio fue llamado con los argumentos correctos
            expect(mockTicketsService.create).toHaveBeenCalledWith(input);

            // Verificamos que el método 'create' del controlador devuelve lo que el servicio devuelve
            expect(result).toBe(resultTicket);

        });
    });
})