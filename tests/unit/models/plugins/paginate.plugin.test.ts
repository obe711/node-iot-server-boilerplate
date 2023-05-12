import mongoose, { Model, Document, Schema } from 'mongoose';
import setupTestDB from '../../../utils/setupTestDB';
import { IQueryResult } from '../../../../src/contracts/paginate.interfaces';
import paginate from '../../../../src/models/plugins/paginate.plugin';

interface ProjectFields {
  name: string;
}

interface ProjectDocument extends Document, ProjectFields {
  tasks?: Array<TaskDocument['_id']>;
}

interface ProjectModel extends Model<ProjectDocument> {
  searchableFields(): Array<keyof ProjectFields>;
  toJSON: (arg0: Schema) => Promise<any>;
  paginate: (filter: Record<string, any>, options: Record<string, any>, search?: string) => Promise<IQueryResult>;
}


const projectSchema = new mongoose.Schema<ProjectDocument, ProjectModel>({
  name: {
    type: String,
    required: true,
  },
});

projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
});

projectSchema.plugin(paginate);

projectSchema.statics.searchableFields = function () {
  return ['name'];
};

const Project = mongoose.model<ProjectDocument, ProjectModel>('Project', projectSchema);

interface TaskFields {
  name: string;
  project: ProjectDocument['_id'];
}

interface TaskDocument extends Document, TaskFields {}

interface TaskModel extends Model<TaskDocument> {
  searchableFields(): Array<keyof TaskFields>;
  toJSON: (arg0: Schema) => Promise<any>;
  paginate: (filter: Record<string, any>, options: Record<string, any>, search?: string) => Promise<IQueryResult>;
}

const taskSchema = new mongoose.Schema<TaskDocument, TaskModel>({
  name: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Project',
    required: true,
  },
});

taskSchema.plugin(paginate);

taskSchema.statics.searchableFields = function () {
  return ['name'];
};

const Task = mongoose.model<TaskDocument, TaskModel>('Task', taskSchema);

setupTestDB();

describe('paginate plugin', () => {
  describe('populate option', () => {
    test('should populate the specified data fields', async () => {
      const project = await Project.create({ name: 'Project One' });
      const task = await Task.create({ name: 'Task One', project: project._id });

      const taskPages = await Task.paginate({ _id: task._id }, { populate: 'project' });

      expect(taskPages.results[0].project).toHaveProperty('_id', project._id);
    });

    test('should populate nested fields', async () => {
      const project = await Project.create({ name: 'Project One' });
      const task = await Task.create({ name: 'Task One', project: project._id });

      const projectPages = await Project.paginate({ _id: project._id }, { populate: 'tasks.project' });
      const { tasks } = projectPages.results[0];

      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toHaveProperty('_id', task._id);
      expect(tasks[0].project).toHaveProperty('_id', project._id);
    });
  });
});

