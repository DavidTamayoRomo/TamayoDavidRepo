import { Component, OnInit, ViewChild } from '@angular/core';
import { Ticket } from 'src/domain/ticket';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from 'src/service/productservice';
import { FormBuilder, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { AppService } from './app.service';
import { Paginar } from 'src/domain/pagination';
import { Table } from 'primeng/table';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, ConfirmationService]
})


export class AppComponent implements OnInit {
  productDialog: boolean = false;

  products!: Ticket[];

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

  public total: number = 0;
  public desde: number = 0;

  first: number = 0;
  rows: number = 5;

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
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.obtenerTickets();
    this.statuses = [
      { label: 'VERIFIED', value: 'verify' },
      { label: 'APPROVED', value: 'approved' },
      { label: 'REJECTED', value: 'rejected' }
    ];
    this.priority = [
      { label: 'HIGH', value: 'high' },
      { label: 'MEDIUM', value: 'medium' },
      { label: 'LOW', value: 'low' }
    ];
    this.category = [
      { label: 'INCIDENT', value: 'incident' },
      { label: 'SUPPORT', value: 'support' },
      { label: 'ERROR', value: 'error' }
    ];
  }


 

  obtenerTickets() {
    console.log('PAGINADO ', this.paginar);
    this.appService.getTickets(this.paginar).subscribe((resp: any) => {
      console.log(resp);
      this.products = resp.data.tickets.data;
      this.total = resp.data.tickets.total;

    })
  }

  openNew() {
    //this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  editProduct(product: Ticket) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Ticket) {
    /* this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => val.id !== product.id);
        this.product = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    }); */
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
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
      this.appService.createTicket(ticket).subscribe({
        next: (resp: any) => {
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
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
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

  cambio() {
    console.log(this.registerForm.get('prioridad'));
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

  paginarResultado(){
    this.paginar.offset = this.first;
    this.obtenerTickets();
    
  }
}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}