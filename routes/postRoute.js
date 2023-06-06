import express from 'express'
import { getAllPosts,
        getPost,
        createPost,
        deletePost,
        likePost,
        getPostsBySearch } from '../controllers/postController.js'
import authMiddleware from '../middleware/authMiddleware.js'


// Set up our router
const router = express.Router()



router.get('/',  getAllPosts)
router.get('/getPost/:id',  getPost)
router.get('/search', getPostsBySearch)


router.post('/', authMiddleware, createPost)
router.delete('/:id', authMiddleware, deletePost)
router.patch('/:id', authMiddleware, likePost)


export default router