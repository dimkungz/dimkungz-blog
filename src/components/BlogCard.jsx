import { Link } from 'react-router-dom'

function BlogCard(props) {
  const { id, image, category, title, description, author, date } = props

  return (
    <div className="flex flex-col gap-4">
      <Link to={`/post/${id}`} className="relative h-[212px] sm:h-[360px]">
        <img
          className="h-full w-full rounded-md object-cover"
          src={image}
          alt={title}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex">
          <span className="mb-2 rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
            {category}
          </span>
        </div>
        <Link to={`/post/${id}`}>
          <h2 className="mb-2 line-clamp-2 text-start text-xl font-bold hover:underline">
            {title}
          </h2>
        </Link>
        <p className="mb-4 line-clamp-3 grow text-sm text-muted-foreground">
          {description}
        </p>
        <div className="flex items-center text-sm">
          <img
            className="mr-2 h-8 w-8 rounded-full"
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt={author}
          />
          <span>{author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
