import { Link } from "@tanstack/react-router";
import styles from "@/components/Footer/Footer.module.css";
import Button from "@/components/ui/Button";

import { companyLinks, jobCategories } from "@/constants/FooterLinks";
import { JobIcon } from "../Icons";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <div className={styles.brandHeader}>
            <JobIcon />
            <h3>Job</h3>
          </div>
          <p>Quis enim pellentesque viverra tellus eget malesuada facilisis.</p>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Job Categories</h4>
          <ul>
            {jobCategories.map((category) => (
              <li key={category.name}>
                <Link to={category.path}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Newsletter</h4>
          <form>
            <input placeholder="Email Address" aria-label="Email Address" />
            <Button type="submit">Subscribe now</Button>
          </form>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© Copyright Job Portal 2024</p>
        <div>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
