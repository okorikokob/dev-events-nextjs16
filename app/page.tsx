import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { events } from '@/lib/constants'




const page = () => {
  return (
    <div>
      <h1 className='text-center'>GitHub Universe 2026</h1>
      <p className='text-center mt-5'>GitHub’s two-day developer event celebrating innovation, collaboration, and the boundless potential of AI-powered development.</p>

      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>
        <ul className='events'>
          {events.map((event)=>(
            <li key={event.title} className='mb-10'>
              <EventCard {...event} />
             
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}

export default page