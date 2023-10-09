import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Paginar } from 'src/domain/pagination';



@Injectable({
  providedIn: 'root'
})
export class AppService {

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

}
