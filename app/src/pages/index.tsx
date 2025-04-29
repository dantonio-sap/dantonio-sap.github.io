import type { ReactNode } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";
import React from "react";
import { useAuth } from "../authProviderApprouter";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const { isLoggedIn, login, logout, user } = useAuth();

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          {isLoggedIn ? (
            <div>
              <p>
                Welcome, {user.firstName} {user.lastName}!
              </p>
              <div>UserId: {user.ID}</div>
              <div>Type: {user.type}</div>
              <div>Company: {user.company}</div>
              <div>CompanyId: {user.sapBpidOrg}</div>
              <div>Email: {user.email}</div>
              <button onClick={() => logout()} className="button button--secondary button--lg">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => login()} className="button button--secondary button--lg">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
