import { Schema, model, Document } from 'mongoose';

interface Example extends Document {
  // Define your schema properties here
}

const exampleSchema = new Schema<Example>({
  // Define your schema properties here
});

export default model<Example>('Example', exampleSchema);
