import mongoose, { Schema, Model, Document } from 'mongoose';

interface IModel extends Document {}

const toJSONPlugin = (schema: Schema) => {
  schema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options.private) {
          delete ret[path];
        }
      });
    },
  });
};

describe('toJSON plugin', () => {
  let connection: mongoose.Connection;
  let Model: Model<IModel>;

  beforeEach(() => {
    connection = mongoose.createConnection();
    const schema = new Schema({});
    toJSONPlugin(schema);
    Model = connection.model<IModel>('Model', schema);
  });

  it('should replace _id with id', () => {
    const doc = new Model();
    const json = doc.toJSON();
    expect(json).not.toHaveProperty('_id');
    expect(json).toHaveProperty('id', doc._id.toString());
  });

  it('should remove __v', () => {
    const doc = new Model();
    const json = doc.toJSON();
    expect(json).not.toHaveProperty('__v');
  });

  it('should remove createdAt and updatedAt', () => {
    const schema = new Schema({}, { timestamps: true });
    toJSONPlugin(schema);
    const Model = connection.model<IModel>('Model', schema);
    const doc = new Model();
    const json = doc.toJSON();
    expect(json).not.toHaveProperty('createdAt');
    expect(json).not.toHaveProperty('updatedAt');
  });

  it('should remove any path set as private', () => {
    const schema = new Schema({
      public: { type: String },
      private: { type: String, private: true },
    });
    toJSONPlugin(schema);
    const Model = connection.model<IModel>('Model', schema);
    const doc = new Model({ public: 'some public value', private: 'some private value' });
    const json = doc.toJSON();
    expect(json).not.toHaveProperty('private');
    expect(json).toHaveProperty('public');
  });

  it('should remove any nested paths set as private', () => {
    const schema = new Schema({
      public: { type: String },
      nested: {
        private: { type: String, private: true },
      },
    });
    toJSONPlugin(schema);
    const Model = connection.model<IModel>('Model', schema);
    const doc = new Model({
      public: 'some public value',
      nested: {
        private: 'some nested private value',
      },
    });
    const json = doc.toJSON();
    expect(json).not.toHaveProperty('nested.private');
    expect(json).toHaveProperty('public');
  });

  it('should also call the schema toJSON transform function', () => {
    const schema = new Schema(
      {
        public: { type: String },
        private: { type: String },
      },
      {
        toJSON: {
          transform: (doc, ret) => {
            delete ret.private;
          },
        },
      }
    );
    toJSONPlugin(schema);
    const Model = connection.model<IModel>('Model', schema);
    const doc = new Model({ public: 'some public value', private: 'some private value' });
    const json = doc.toJSON();
    expect(json).not.toHaveProperty('private');
    expect(json).toHaveProperty('public');
  });
});

