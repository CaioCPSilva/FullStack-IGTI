import express from 'express';

import { studentModel } from '../models/studentModel.js';

const app = express();

//CREATE
app.post('/student', async (req, res) => {
  try {
    const student = new studentModel(req.body);
    await student.save();
    res.send(student);
  } catch (err) {
    res.status(500).send(err);
  }
});

//RETRIEVE
app.get('/student', async (req, res) => {
  try {
    const student = await studentModel.find({});
    res.send(student);
  } catch (err) {
    res.status(500).send(err);
  }
});

//UPDATE
app.patch('/student/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const student = await studentModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.send(student);
  } catch (err) {
    res.status(500).send(err);
  }
});

//DELETE
app.delete('/student/:id', async (req, res) => {
  try {
    const student = await studentModel.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!student) {
      res.status(404).send('Documento não encontrado na collection');
    } else {
      res.send(200).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

export { app as studentRouter };
