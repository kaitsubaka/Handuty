import {connect} from 'mongoose';
import {GLOBAL} from '../constants/global.const';
export const initMongoose = () => {
  // Mongoose
  // - set up default mongoose connection
  connect(
      process.env.MONGODB_URL || GLOBAL.MONGODB_URL,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err) =>
      err ?
        console.log('MongoDB connection error:', err) :
        console.log('MongoDB connection success'),
  );
};
