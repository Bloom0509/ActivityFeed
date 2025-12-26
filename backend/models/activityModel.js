const mongoose=require("mongoose")

const ActivitySchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  actorId: { type: String, required: true },
  actorName: String,
  type: { type: String, required: true },
  entityId: String,
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

ActivitySchema.index({ tenantId: 1, createdAt: -1 });

module.exports=mongoose.model("Activity", ActivitySchema);
