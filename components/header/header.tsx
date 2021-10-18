import Image from 'next/image'
import styles from '../../styles/Header.module.css'
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LinearProgress, Link } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    uploadButton: {
      color: 'var(--leaphy-color-light)',
      backgroundColor: 'var(--leaphy-color-secundary)',
      fontSize: '12px',
      fontWeight: 'normal',
      borderRadius: '20px',
      height: '36px',
      margin: '0 5px',
      display: 'flex',
      textTransform: 'none'
    }
  }),
);

type HeaderProps = {
  onUploadClicked?: () => void | undefined;
}

const Header: React.FC<HeaderProps> = ({ onUploadClicked }) => {
  const classes = useStyles();
  let button;
  if (onUploadClicked) {
    button = <Button className={classes.uploadButton} onClick={onUploadClicked}>Upload</Button>
  }
  return (<div className={styles.container}>
    <Link href="/">
      <a>
        <Image src="/leaphy-logo.svg" alt="Leaphy Easybloqs Logo" width={224} height={18} />
      </a>
    </Link>

    {button}
  </div>)
}

export default Header