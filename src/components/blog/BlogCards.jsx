import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import { useTranslation } from 'react-i18next';
import { taxonomy } from 'virtual:blog';
import { formatBlogDate, localized } from '../../utils/blog';
import { BASE_PATH, getBlogCollectionUrl, getBlogTranslationUrl } from '../../utils/routes';
import { followBlogLink } from './BlogLayout';

const covers = { salesforce: 'architecture', gestao: 'mountains', processos: 'architecture', ideias: 'code', inovacao: 'code', administracao: 'architecture' };

export default function BlogCards({ posts, featured = false }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || 'pt').split('-')[0];
  return <div className={featured ? 'blog-feature-list' : 'blog-article-list'}>
    {posts.map(post => {
      const category = taxonomy.categories.find(item => item.slug === post.category);
      const cover = post.slug === 'flow-apex-lwc' ? 'code' : covers[post.category] || 'code';
      const url = getBlogTranslationUrl(post, lang);
      return <article key={post.slug} className={featured ? 'blog-feature' : 'blog-article-row'}>
        <img className="blog-article-image" src={`${BASE_PATH}/images/blog/${cover}.webp`} alt="" loading={featured ? 'eager' : 'lazy'} width={featured ? 1200 : 320} height={featured ? 700 : 220} />
        <div className="blog-article-copy">
          {category && <a className="blog-category-label" href={getBlogCollectionUrl('categoria', category.slug)} onClick={followBlogLink}>{localized(category.name, lang)}</a>}
          <h3><a href={url} onClick={followBlogLink}>{localized(post.title, lang)}</a></h3>
          <p className="blog-excerpt">{localized(post.excerpt, lang)}</p>
          <div className="blog-meta">
            <span><CalendarTodayOutlined />{post.publishedAt ? <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, lang)}</time> : t('blog.awaitingPublication')}</span>
            <span><ScheduleOutlined />{t('blog.readingTime', { count: post.readingMinutes })}</span>
          </div>
          {!post.languages.includes(lang) && <span className="blog-original">{t('blog.originalPt')}</span>}
          {featured && <a className="blog-read-link" href={url} onClick={followBlogLink}>{t('blog.editorial.readArticle')}<span className="sr-only">: {localized(post.title, lang)}</span></a>}
        </div>
      </article>;
    })}
  </div>;
}