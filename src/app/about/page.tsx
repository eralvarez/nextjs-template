import Link from 'next/link';

export default function About() {
  return (
    <div>
      <main>
        <h1>About Us</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, eum voluptate eaque, libero at nisi eius enim
          doloribus distinctio exercitationem pariatur magni nemo harum eligendi dolores facere dolor? In, pariatur?
        </p>

        <div>
          <Link href="/">Return Home</Link>
        </div>
      </main>
    </div>
  );
}
