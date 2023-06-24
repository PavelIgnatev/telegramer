const { MongoClient, ObjectId } = require("mongodb");

const dbName = "telegram";
const collectionName = "responses";
const uri =
  "mongodb+srv://qwerty:qwerty123@atlascluster.2ry9k50.mongodb.net/?retryWrites=true&w=majority";

class ResponsesService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;

    this.connect = this.connect.bind(this);
    this.postResponse = this.postResponse.bind(this);
    this.getResponse = this.getResponse.bind(this);
    this.getAllResponses = this.getAllResponses.bind(this);
  }

  async connect() {
    if (this.client) {
      return;
    }

    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.client.db(dbName);
    this.collection = this.db.collection(collectionName);
  }

  async postResponse(response) {
    await this.connect();
    
    await this.collection.updateOne(
      { username: response.username },
      { $set: response },
      { upsert: true }
    );
  }
  

  async getResponse(username) {
    await this.connect();
    return await this.collection.findOne({ username });
  }

  async getAllResponses() {
    await this.connect();
    return await this.collection.find().toArray();
  }
}

module.exports = new ResponsesService();
