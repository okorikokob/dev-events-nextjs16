export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "React Conf 2026",
    image: "/images/event1.png",
    slug: "react-conf-2026",
    location: "Las Vegas, Nevada",
    date: "May 15-17, 2026",
    time: "9:00 AM - 6:00 PM",
  },
  {
    title: "Web Summit Europe",
    image: "/images/event2.png",
    slug: "web-summit-europe",
    location: "Lisbon, Portugal",
    date: "June 10-12, 2026",
    time: "8:30 AM - 5:30 PM",
  },
  {
    title: "Next.js Conf",
    image: "/images/event3.png",
    slug: "nextjs-conf",
    location: "San Francisco, California",
    date: "April 20-22, 2026",
    time: "10:00 AM - 7:00 PM",
  },
  {
    title: "Tech Crunch Disrupt",
    image: "/images/event4.png",
    slug: "techcrunch-disrupt",
    location: "San Francisco, California",
    date: "September 22-24, 2026",
    time: "9:00 AM - 6:00 PM",
  },
  {
    title: "DevOps Days Global",
    image: "/images/event5.png",
    slug: "devops-days-global",
    location: "Amsterdam, Netherlands",
    date: "June 3-5, 2026",
    time: "8:00 AM - 5:00 PM",
  },
  {
    title: "GitHub Universe",
    image: "/images/event6.png",
    slug: "github-universe",
    location: "San Francisco, California",
    date: "November 10-12, 2026",
    time: "9:00 AM - 6:00 PM",
  },
];
