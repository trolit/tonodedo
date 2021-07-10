const db = require("../models");
const Task = db.task;

exports.create = (req, res) => {

    Task.create({
        description: req.body.description,
        userEmail: req.body.email
    })
        .then(() => {
            res.status(201).send({ message: "Task added successfully!" });
        })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

}

exports.findAllByEmail = (req, res) => {

    Task.findAll({
        where: {
            userEmail: req.body.email
        }
    })
        .then(data => {
            res.status(200).send(data);
        })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

}

exports.delete = (req, res) => {

    const id = req.params.id;
  
    Task.destroy({
        where: { 
            id: id 
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: `Task ${id} deleted successfully!`
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
        })
    .catch(() => {
        res.status(500).send({
            message: `Could not delete Tutorial with id=${id}`
        });
    });
};

exports.update = (req, res) => {
    const id = req.params.id;
  
    Task.update(req.body, {
        where: { 
            id: id 
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Task updated successfully."
                });
            } else {
                res.send({
                    message: `Couldn't update task with id=${id}.`
                });
            }
        })
    .catch(() => {
        res.status(500).send({
            message: "Error updating task with id=" + id
        });
    });
};