import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as Papa from 'papaparse';
import * as Joi from 'joi';
import { AccountType, statusType } from '../../constants/RepositoryEnums';

@Injectable()
export class FilesService {

  constructor(){}

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  async processCsv(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
       if (file.size <= 44) {
        resolve({ error: 'The file is empty.' });
        return;
      }

      if (file.mimetype !== 'text/csv') {
        resolve({ error: 'The file is not a CSV.' });
        return;
      }

      const validRecords = [];
      const errors = [];
      const idSet = new Set(); 
      const today = new Date().toISOString().split('T')[0];

      Papa.parse(file.buffer.toString('utf8'), {
        header: true,
        skipEmptyLines: true,
        complete: (result: any) => {
          const schema = Joi.object({
            id: Joi.number().integer().required(),
            balance: Joi.number().required(),
            account: Joi.string().valid(AccountType.INTERNAL, AccountType.OPERATIONS, AccountType.PEOPLE).required(),
            description: Joi.string().max(500).required(),
            status: Joi.string().valid(statusType.PENDING, statusType.PROCESSED).required(),
            date: Joi.string().pattern(new RegExp(`^${today}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$`)).required()
          });

          const batchSize = +process.env.BATCH_SIZE;
          for (let i = 0; i < result.data.length; i += batchSize) {
            console.log('BATCH ',i);
            const batch = result.data.slice(i, i + batchSize);
          
            for (const row of batch) {
              if (idSet.has(row.id)) {
                errors.push({ row, error: 'Duplicated record' });
                continue;
              }
              idSet.add(row.id);
              const validation = schema.validate(row);
              if (validation.error) {
                errors.push({ error: validation.error });
              } else {
                validRecords.push(row);
              }
            }
          }

          resolve({ validRecords, errors });
        }
      });
    });
  }

}
