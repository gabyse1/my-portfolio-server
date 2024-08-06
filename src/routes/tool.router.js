import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import validateToolInput from '../validations/tool';
import Tool from '../models/Tool';
import Project from '../models/Project';
import isAuth from '../helpers/isAuth';

const toolRouter = Router();

// routes
toolRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const tools = await Tool.find({}).lean();
    return res.json(tools);
  }),
);

toolRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const tool = await Tool.findById(req.params.id).lean();
    if (!tool) return res.status(404).json({ message: { error: 'Tool Not Found' } });
    return res.json(tool);
  }),
);

toolRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { errors, isValid } = validateToolInput(req.body);
    if (!isValid) return res.status(400).json({ message: errors });

    const newTool = new Tool(req.body);
    const createdTool = await newTool.save();
    return res.json(createdTool);
  }),
);

toolRouter.post(
  '/edit/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const tool = await Tool.findById(req.params.id);

    if (!tool) return res.status(400).json({ message: { error: 'Tool Not Found' } });

    tool.name = req.body.name || tool.name;
    if (req.body.icon.trim() !== '') tool.icon = req.body.icon;

    const { errors, isValid } = validateToolInput(tool);
    if (!isValid) return res.status(400).json({ message: errors });

    const updatedTool = await tool.save();
    return res.json(updatedTool);
  }),
);

toolRouter.delete(
  '/delete/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const tool = await Tool.findById(req.params.id);

    if (!tool) return res.status(400).json({ message: { error: 'Tool Not Found' } });

    const projects = await Project.find({ tools: { $in: [req.params.id] } });
    if (projects.length > 0) return res.status(400).json({ message: { error: 'It cannot be deleted. It is referenced from a project' } });

    const deletedTool = await tool.delete();

    return res.json(deletedTool);
  }),
);

export default toolRouter;
