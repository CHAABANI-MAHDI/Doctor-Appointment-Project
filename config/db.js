
import mongoose from 'mongoose';


// const connectDB = async  () => {
//     await mongoose.connect(
//   'mongodb+srv://docMahdi:docMahdi2026@cluster0.ldcsrtx.mongodb.net/'
// ).then(() => {
//   console.log("connected to mongodb ✔");
// }).catch(err => {
//   console.log(err + "❌");
// });

// }


const connectDB = async  () => {
    await mongoose.connect(
  process.env.MONGO_URI
).then(() => {
  console.log("connected to mongodb ✔");
}).catch(err => {
  console.log("❌", err);
});

}


export default connectDB