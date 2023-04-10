const DashboardLayout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav>Hello</nav>

      {children}
    </section>
  );
};

export default DashboardLayout;
