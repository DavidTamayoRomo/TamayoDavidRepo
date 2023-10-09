import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { CommonModule } from './modules/common/common.module';
import { StateService } from './services/state/state.service';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './middleware/custom-exception-filter';
import { FilesModule } from './modules/files/files.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    DatabaseModule,
    HttpModule,
    CommonModule,
    TicketsModule,
    FilesModule
  ],
  controllers: [],
  providers: [
    {
      provide:APP_FILTER,
      useClass: CustomExceptionFilter
    },
    StateService
  ],
  exports:[
    
  ]
})
export class AppModule  {}
