
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Paginar } from 'src/domain/pagination';

@Injectable()
export class TicketService {

  constructor(private apollo: Apollo) { }


  getTickets(paginar: Paginar) {
    return this.apollo.query({
      query: gql`
      query Query($offset: Int, $limit: Int) {
        tickets(offset: $offset, limit: $limit) {
          data {
            id
            category
            status
            priority
            title
            description
            createdAt
            updatedAt
          }
          total
        }
      }
      `,
      variables: {
        ...paginar
      }
    })
  }

  getTicket(ticketId: string) {
    return this.apollo.query({
      query: gql`
        query GetTicket($id: ID!) {
          ticket(id: $id) {
            id
            title
            description
          }
        }
      `,
      variables: {
        id: ticketId
      }
    });
  }

  createTicket(ticket: any) {
    return this.apollo.mutate({
      mutation: gql`
      mutation Mutation($createTicketInput: CreateTicketInput!) {
        createTicket(createTicketInput: $createTicketInput) {
          id
          category
          status
          priority
          title
          description
          createdAt
          updatedAt
        }
      }
      `,
      variables: {
        createTicketInput: ticket
      }
    });
  }

  updateTicket(ticketId: string, ticket: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdatePost($id: ID!, $content: String!) {
          updatePost(id: $id, content: $content) {
            id
            title
            content
          }
        }
      `,
      variables: {
        id: ticketId,
        content: ticket
      }
    });
  }

  deleteTicket(ticketId: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeletePost($id: ID!) {
          deletePost(id: $id) {
            id
          }
        }
      `,
      variables: {
        id: ticketId
      }
    });
  }

  searchTickets(search: any) {
    return this.apollo.mutate({
      mutation: gql`
      mutation SearchTickets($limit: Int, $category: [String!], $priority: [String!], $end: DateTime, $start: DateTime) {
        searchTickets(limit: $limit, category: $category, priority: $priority, end: $end, start: $start) {
          data {
            id
            category
            status
            priority
            title
            description
            createdAt
            updatedAt
          }
          total
        }
      } 
    `,
      variables: {
        limit: 100,
        ...search
      }
    });
  }



  //FILTROS DE BUSQUEDA
  getTreeNodesData() {
    return [
      {
        key: '0',
        label: 'category',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
          {
            key: '0-0',
            label: 'incident',
            data: 'Work Folder',
            icon: 'pi pi-arrow-circle-right'
          },
          {
            key: '0-1',
            label: 'support',
            data: 'Home Folder',
            icon: 'pi pi-arrow-circle-right',
          },
          {
            key: '0-2',
            label: 'error',
            data: 'Home Folder',
            icon: 'pi pi-arrow-circle-right',
          }
        ]
      },
      /* {
        key: '1',
        label: 'status',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
          {
            key: '1-0',
            label: 'verified',
            data: 'Work Folder',
            icon: 'pi pi-arrow-circle-right'
          },
          {
            key: '1-1',
            label: 'approved ',
            data: 'Home Folder',
            icon: 'pi pi-arrow-circle-right',
          },
          {
            key: '1-2',
            label: 'rejected ',
            data: 'Home Folder',
            icon: 'pi pi-arrow-circle-right',
          }
        ]
      }, */
      {
        key: '1',
        label: 'priority',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
          {
            key: '1-0',
            label: 'high',
            data: 'Work Folder',
            icon: 'pi pi-arrow-circle-right'
          },
          {
            key: '1-1',
            label: 'medium',
            data: 'Home Folder',
            icon: 'pi pi-arrow-circle-right',
          },
          {
            key: '1-2',
            label: 'low',
            data: 'Home Folder',
            icon: 'pi pi-arrow-circle-right',
          }
        ]
      }
    ];
  }


  getSearch() {
    return Promise.resolve(this.getTreeNodesData());
  }

};