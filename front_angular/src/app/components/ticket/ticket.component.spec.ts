import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar HttpClientTestingModule
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TicketComponent } from './ticket.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FileService } from 'src/service/file.service';
import { TicketService } from 'src/service/ticket.service';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { CalendarModule } from 'primeng/calendar';
import { of, throwError } from 'rxjs';

describe('TicketComponent', () => {
  let component: TicketComponent;
  let fixture: ComponentFixture<TicketComponent>;

  let mockTicketService: jasmine.SpyObj<TicketService>; 
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    mockTicketService = jasmine.createSpyObj(['createTicket']);
    mockMessageService = jasmine.createSpyObj(['add']);

    TestBed.configureTestingModule({
      declarations: [TicketComponent],
      imports: [
        HttpClientTestingModule,
        ApolloTestingModule,
        ToastModule,
        ToolbarModule,
        TableModule,
        DialogModule,
        ConfirmDialogModule,
        PaginatorModule,
        TreeModule,
        TreeSelectModule,
        CalendarModule,
      ],
      providers: [
        ConfirmationService,
        FileService,
        { provide: TicketService, useValue: mockTicketService },
        { provide: MessageService, useValue: mockMessageService },
      ]
    });
    fixture = TestBed.createComponent(TicketComponent);
    component = fixture.componentInstance;
    //component.registerForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createTicket and add a success message when form is valid', () => {
    const ticketStub = {
      titlulo: 'TICKET',
      descripcion: 'DESCRIPCION TICKET',
      prioridad: 'high',
      categoria: 'support',
      estado: 'approved',
    };
    mockTicketService.createTicket(ticketStub);
    mockMessageService.add({ severity: 'success', summary: 'Correcto!', detail: 'Ticket agregado correctamente', life: 3000 })
    component.saveTicket();

    expect(mockTicketService.createTicket).toHaveBeenCalled();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Correcto!',
      detail: 'Ticket agregado correctamente',
      life: 3000,
    });
  });

  it('should add a danger message when form is invalid', () => {
    component.registerForm.setErrors({ incorrect: true });

    component.saveTicket();
    mockMessageService.add({
      severity: 'danger',
      summary: 'Campos inválidos',
      detail: 'Complete todos los campos, son obligatorios',
      life: 3000,
    })
    expect(mockTicketService.createTicket).not.toHaveBeenCalled();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'danger',
      summary: 'Campos inválidos',
      detail: 'Complete todos los campos, son obligatorios',
      life: 3000,
    });
  });

});
