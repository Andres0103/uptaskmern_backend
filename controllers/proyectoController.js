//Importamos el modelo de proyecto
import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find({
        //mostramos los proyectos a los colaboradores
        '$or' : [
            {'colaboradores': {$in: req.usuario}},
            {'creador': {$in: req.usuario}}
        ]
    })
    .select('-tareas');
   
    res.json(proyectos);
  };

const nuevoProyecto = async(req, res) => {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error)
    }
};

const obtenerProyecto = async(req, res) => {

    const { id } = req.params;

    const proyecto = await Proyecto.findById(id)
    .populate({path: 'tareas', populate: {path: 'completado', select: 'nombre'}})
    .populate('colaboradores', 'nombre email');

    if(!proyecto) {
        const error = new Error('No Encontrado');
        return res.status(404).json({msg: error.message});
    };
    
    if(
        proyecto.creador.toString() !== req.usuario._id.toString() && 
        !proyecto.colaboradores.some(
            (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
        )
    ) {
        const error = new Error('Acción no Válida');
        return res.status(401).json({msg: error.message});
    }

    res.json(proyecto);
};

const editarProyecto = async(req, res) => {

    const { id } = req.params;

    const proyecto = await Proyecto.findById(id);

    if(!proyecto) {
        const error = new Error('No Encontrado');
        return res.status(404).json({msg: error.message});
    };
    
    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no Válida');
        return res.status(401).json({msg: error.message});
    }
    
    //Si el usuario manda por req.body se asgina, si no usa la BD.
    //Es decir, si no hace cambio en un campo, asigna el valor de la BD, si hace cambio lo envia con req.body
    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    //try cathc en caso de errores

    try {
        const proyectoAlmacenado = await proyecto.save();
        return res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }

};

const eliminarProyecto = async(req, res) => {

    const { id } = req.params;

    const proyecto = await Proyecto.findById(id);

    if(!proyecto) {
        const error = new Error('No Encontrado');
        return res.status(404).json({msg: error.message});
    };
    
    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no Válida');
        return res.status(401).json({msg: error.message});
    }

    try {
        await proyecto.deleteOne();
        res.json({msg:'Proyecto Eliminado'})
    } catch (error) {
        console.log(error);
    }
};

const buscarColaborador = async(req, res) => {
    const {email} = req.body;
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if(!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message});
    }

    res.json(usuario);
};

const agregarColaborador = async(req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);

    //valida que el proyecto exista
    if(!proyecto) {
        const error = new Error('Proyecto No Encontrado')
        return res.status(404).json({msg: error.message})
    }

    //Se valida que el que añade al proyecto, no sea un colaborador. SOlo el creador puede agregar
    if(proyecto.creador.toString() !== req.usuario._id.toString() ) {
        const error = new Error('Acción no Válida')
        return res.status(404).json({msg: error.message})
    }

    const {email} = req.body;
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    //valida que el usuario exista
    if(!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message});
    }

    //Se valida que el colaborador no sea el admin del proyecto
    if(proyecto.creador.toString() === usuario._id.toString() ) {
        const error = new Error('El creador del proyecto no puede ser colaborador');
        return res.status(404).json({msg: error.message});
    }

    //validar que el usuario no este agregado ya al proyecto
    if(proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error('El usuario ya pertenece al Proyecto');
        return res.status(404).json({msg: error.message});
    }

    //Si todo esta bien, se agrega el colaborador
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.json({msg: 'Colaborador Agregado Correctamente'})
};

const eliminarColaborador = async(req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);

    //valida que el proyecto exista
    if(!proyecto) {
        const error = new Error('Proyecto No Encontrado')
        return res.status(404).json({msg: error.message})
    }

    //Se valida que el que añade al proyecto, no sea un colaborador. SOlo el creador puede agregar
    if(proyecto.creador.toString() !== req.usuario._id.toString() ) {
        const error = new Error('Acción no Válida')
        return res.status(404).json({msg: error.message})
    }

    //Si todo esta bien, se puede eliminar
    proyecto.colaboradores.pull(req.body.id)
    await proyecto.save()
    res.json({msg: 'Colaborador Eliminado Correctamente'})
};


export{
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
    
};
