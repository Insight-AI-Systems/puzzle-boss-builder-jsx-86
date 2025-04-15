
import SimpleHome from '@/pages/simple/Home';
import SimpleAbout from '@/pages/simple/About';
import SimpleAuth from '@/pages/simple/Auth';

export const routes = [
  {
    path: "/",
    element: <SimpleHome />
  },
  {
    path: "/about",
    element: <SimpleAbout />
  },
  {
    path: "/auth",
    element: <SimpleAuth />
  }
];

