import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CategoryPipe } from 'src/app/shared/pipes/category.pipe';
import { Paginar } from 'src/domain/pagination';
import { Ticket } from 'src/domain/ticket';
import { FileService } from 'src/service/file.service';
import { TicketService } from 'src/service/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  providers: [MessageService, ConfirmationService, FileService, TicketService]
})
export class TicketComponent implements OnInit {

  datosUpload:any;
  uploadedFiles: any[] = [];
  rangeDates: Date[] | undefined;
  nodes!: any[];
  selectedNodes: any;
  productDialog: boolean = false;
  productDialog1: boolean = false;
  tickets!: Ticket[];
  product!: Ticket;
  selectedProducts!: Ticket[] | null;
  submitted: boolean = false;
  statuses!: any[];
  priority!: any[];
  category!: any[];

  paginar: Paginar = {
    offset: 0,
    limit: 5
  }

  consulta: any={};

  public total: number = 0;
  public desde: number = 0;

  first: number = 0;
  rows: number = 5;

  bandera: boolean = true;

  @ViewChild('dt') dataTable!: Table;

  public registerForm = this.fb.group({
    titlulo: [null, Validators.required],
    descripcion: [null, Validators.required],
    prioridad: [null, Validators.required],
    categoria: [null, Validators.required],
    estado: [null, Validators.required],

  });

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private fileService:FileService,
    private ticketService:TicketService
  ) {
    this.ticketService.getSearch().then((item) => (this.nodes = item));
  }
  ngOnInit() {
    this.obtenerTickets();
    this.statuses = [
      { label: 'VERIFICADO', value: 'verify' },
      { label: 'APROBADO', value: 'approved' },
      { label: 'RECHAZADO', value: 'rejected' }
    ];
    this.priority = [
      { label: 'ALTO', value: 'high' },
      { label: 'MEDIO', value: 'medium' },
      { label: 'BAJO', value: 'low' }
    ];
    this.category = [
      { label: 'INCIDENTE', value: 'incident' },
      { label: 'SUPORTE', value: 'support' },
      { label: 'ERROR', value: 'error' }
    ];
  }



  informacion(event: any) {
    //console.log('TREE',event);
    let priority: any = [];
    let category: any = [];
    event.forEach((element: any) => {
      //controlar que tenga tres letras
      if (element.key.length == 3) {
        //controlar la primera letra del key
        if (element.key[0] == '0') {
          category.push(element.label)
        }
        if (element.key[0] == '1') {
          priority.push(element.label)
        }
      }
    });
    this.consulta = {
      "priority": priority,
      "category": category
    }
    console.log(this.consulta);
    if (this.consulta.priority.length == 0 && this.consulta.category.length == 0) {
      this.bandera = true;
      this.obtenerTickets();
    } else {
      //realizar la consulta
      this.ticketService.searchTickets(this.consulta).subscribe({
        next: (res: any) => {
          console.log(res);
          this.tickets = res.data.searchTickets.data;
          this.total = res.data.searchTickets.total;
          //poner en false bandera
          this.bandera = false;
        },
        error: (err:any) => { }
      })
    }

  }

  obtenerTickets() {
    console.log('PAGINADO ', this.paginar);
    this.ticketService.getTickets(this.paginar).subscribe((resp: any) => {
      console.log(resp);
      this.tickets = resp.data.tickets.data;
      this.total = resp.data.tickets.total;
    })
  }

  openNew() {
    this.submitted = false;
    this.productDialog = true;
  }

  openFile() {
    this.productDialog1 = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
  hideDialog1() {
    this.productDialog1 = false;
    this.datosUpload = [];
  }

  saveTicket() {
    this.submitted = true;
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      //guardamos
      let ticket: Ticket = {
        category: this.registerForm.value.categoria!,
        status: this.registerForm.value.estado!,
        priority: this.registerForm.value.prioridad!,
        title: this.registerForm.value.titlulo!,
        description: this.registerForm.value.descripcion!,
        createdAt: new Date(),
        updatedAt: new Date(),

      }
      console.log(ticket);
      this.ticketService.createTicket(ticket).subscribe({
        next: (resp: any) => {
          console.log("RESPUESTA",resp );
          this.messageService.add({ severity: 'success', summary: 'Correcto!', detail: 'Ticket agregado correctamente', life: 3000 });
          this.hideDialog();
          this.obtenerTickets();
          this.registerForm.reset();
        },
        error: (err: any) => {
          this.messageService.add({ severity: 'danger', summary: 'Ha ocurrido un error', detail: `Error ${err}`, life: 4000 });
        }
      })
    } else {
      this.messageService.add({ severity: 'danger', summary: 'Campos inválidos', detail: 'Complete todos los campos, son obligatorios', life: 3000 });
    }
  }

  getSeverity(status: string): any {
    switch (status) {
      case 'verify':
        return 'success';
      case 'approved':
        return 'warning';
      case 'rejected':
        return 'danger';
    }
  }

  getPriority(status: string): any {
    switch (status) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      case 'low':
        return 'danger';
    }
  }


  getCategory(status: string): any {
    
    switch (status) {
      case 'incident':
        return 'success';
      case 'support':
        return 'warning';
      case 'error':
        return 'danger';
    }
  }



  campoNoValido(campo: any): boolean {
    if (this.registerForm.get(campo)?.invalid && (this.registerForm.get(campo)?.dirty || this.registerForm.get(campo)?.touched)) {
      return true;
    }
    else {
      return false;
    }
  }

  onPage(event: any) {
    console.log(event);
    /* const page = event.first / event.rows + 1;  // calcula el número de página
    const pageSize = event.rows;  // obtiene el tamaño de la página
    this.fetchData(page, pageSize);  // llama a tu función para obtener datos */
  }

  onPageChange(event: any) {
    console.log(event);
    this.first = event.first;
    this.rows = event.rows;
    this.paginarResultado();
  }

  paginarResultado() {
    this.paginar.offset = this.first;
    this.obtenerTickets();

  }

  datosCalendario(event:any){
    console.log(event);
    if (event[0] && event[1]) {
      Object.assign(this.consulta,{"end": event[1],"start": event[0]});
      this.ticketService.searchTickets(this.consulta).subscribe({
        next: (res: any) => {
          console.log(res);
          this.tickets = res.data.searchTickets.data;
          this.total = res.data.searchTickets.total;
          //poner en false bandera
          this.bandera = false;
        },
        error: (err:any) => { }
      })
    }
  }

  clear(){
    this.bandera = true;
    this.rangeDates = undefined;
    this.consulta={};
    this.selectedNodes = [];
    this.obtenerTickets();

  }


  onUpload(event:any) {
    for(let file of event.files) {
        this.uploadedFiles=file;
    }
    this.fileService.uploadFile(this.uploadedFiles).subscribe((resp:any)=>{
      this.datosUpload =resp;
    })
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
}

}
