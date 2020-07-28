export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Ticket = {
  __typename?: 'Ticket';
  id: Scalars['String'];
  userId: Scalars['String'];
  title: Scalars['String'];
  price: Scalars['Float'];
  description: Scalars['String'];
  imageUrl: Scalars['String'];
  timestamp: Scalars['Float'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  address: Scalars['String'];
  lastOrderId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  tickets: Array<Ticket>;
  ticket: Ticket;
};


export type QueryTicketArgs = {
  id: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTicket: Ticket;
  updateTicket: Ticket;
  removeTicket: Ticket;
};


export type MutationCreateTicketArgs = {
  createTicketInput: CreateTicketInput;
};


export type MutationUpdateTicketArgs = {
  updateTicketInput: UpdateTicketInput;
  id: Scalars['String'];
};


export type MutationRemoveTicketArgs = {
  id: Scalars['String'];
};

export type CreateTicketInput = {
  title: Scalars['String'];
  price: Scalars['Float'];
  quantity?: Maybe<Scalars['Float']>;
  description: Scalars['String'];
  pictureURL?: Maybe<Scalars['String']>;
  timestamp: Scalars['Float'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  address?: Maybe<Scalars['String']>;
};

export type UpdateTicketInput = {
  title?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  pictureURL?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Float']>;
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
  address?: Maybe<Scalars['String']>;
};

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = (
  { __typename?: 'Query' }
  & { tickets: Array<(
    { __typename?: 'Ticket' }
    & Pick<Ticket, 'id' | 'userId' | 'title' | 'price' | 'description' | 'imageUrl' | 'timestamp' | 'address' | 'lat' | 'lng' | 'lastOrderId'>
  )> }
);
