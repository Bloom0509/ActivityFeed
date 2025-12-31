const Activity = require("../models/activityModel");

exports.checkHeaderMiddleware=async(req,res,next)=>{
  const tenantId=req.headers["x-tenant-id"]
  if(tenantId===undefined)
  {
      res.status(400).send({message:"Tenant id is missing!!!"})
  }
  next();
}

exports.createActivity = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];

    const activity = await Activity.create({
      tenantId,
      actorId: req.body.actorId,
      actorName: req.body.actorName,
      type: req.body.type,
      entityId: req.body.entityId,
      metadata: req.body.metadata
    });
    res.status(201).json(activity);
  } catch (error) {res.status(500).json({ message: error.message });}
};

exports.getActivities = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const { cursor, limit = 20 } = req.query;
    const query={tenantId}
    console.log(query,cursor)
    if(cursor)
    {
      query.createdAt= {$lt:new Date(cursor)}
    }
    
    const activities = await Activity.find(query).sort({ createdAt: -1 }).limit(Number(limit)).select("actorName type entityId metadata createdAt");

    console.log(tenantId,cursor,activities)
    res.json({data: activities,
      nextCursor: activities.length? activities[activities.length - 1].createdAt: null});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

