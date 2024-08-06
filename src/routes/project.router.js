import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import validateProjectInput from '../validations/project';
import Project from '../models/Project';
import isAuth from '../helpers/isAuth';

const projectRouter = Router();

// routes
projectRouter.get('/',
  expressAsyncHandler(async (req, res) => {
    const projects = await Project.find().lean();
    return res.json(projects);
  }));

projectRouter.get('/:id',
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).send({ message: { error: 'Project Not Found' } });
    return res.json(project);
  }));

projectRouter.post('/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);
    if (!isValid) return res.status(400).json({ message: errors });

    const newProject = new Project(req.body);
    const createdProject = await newProject.save();
    return res.json(createdProject);
  }));

projectRouter.post('/edit/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(400).json({ message: { error: 'Project Not Found ' } });

    project.title = req.body.title || project.title;
    project.category = req.body.category || project.category;
    project.concept = req.body.concept || project.concept;
    project.tools = req.body.tools || project.tools;
    project.fonts = req.body.fonts || project.fonts;
    project.colors = req.body.colors || project.colors;
    project.main_image = req.body.main_image || project.main_image;
    project.concept_image = req.body.concept_image || project.concept_image;
    project.live_url = req.body.live_url || project.live_url;
    project.source_url = req.body.source_url || project.source_url;
    project.highlighted = req.body.highlighted !== null
      ? req.body.highlighted
      : project.highlighted;

    const { errors, isValid } = validateProjectInput(project);
    if (!isValid) return res.status(400).json({ message: errors });

    const updatedProject = await project.save();
    return res.json(updatedProject);
  }));

projectRouter.delete('/delete/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(400).json({ message: { error: 'Project Not Found' } });

    const deletedProject = await project.delete();
    return res.json(deletedProject);
  }));

export default projectRouter;
