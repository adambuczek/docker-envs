# Nginx Mariadb PHP7 WordPress development

## Production -> Development migration checklist
### Production ([backup.sh](backup.sh))
1. Make a fresh copy of wp-content.
2. Make a fresh mysql dump use `--databases $DB_NAME`, imported dump will use the original name and the database will be created if it doesn't exist. Do not `--compress`, it can be cause MySQL import errors.
3. tar.gz files
### Development
1. Download fresh WP instance (eg. `docker run -v $(pwd):/app -w '/app' pierreprinetti/wp-cli wp --allow-root core download`)
2. Unpack tar to `wp-content`, move the database dump (or don't, just dont upload it to production)
3. Prepare sql file - fix harcoded urls in database:
    ```sql
    UPDATE wp_options SET option_value = replace(option_value, 'https://secure.production', 'https://notsecure.dev') WHERE option_name = 'home' OR option_name = 'siteurl';
    UPDATE wp_posts SET guid = replace(guid, 'https://secure.production','https://notsecure.dev');
    UPDATE wp_posts SET post_content = replace(post_content, 'https://secure.production', 'https://notsecure.dev');
    UPDATE wp_postmeta SET meta_value = replace(meta_value,'https://secure.production','https://notsecure.dev');
    ```
    Given a datbase dump called `database.bak.sql`, production URL `https://secure.production` and dev url `https://notsecure.dev` run this to append a line to `database.bak.sql`
    ```bash
    echo "UPDATE wp_options SET \
    option_value = replace(option_value, 'https://secure.production', 'https://notsecure.dev') \
    WHERE option_name = 'home' OR option_name = 'siteurl'; \
    UPDATE wp_posts SET \
    guid = replace(guid, 'https://secure.production', 'https://notsecure.dev'); \
    UPDATE wp_posts SET \
    post_content = replace(post_content, 'https://secure.production', 'https://notsecure.dev'); \
    UPDATE wp_postmeta SET \
    meta_value = replace(meta_value,'https://secure.production', 'https://notsecure.dev');" >> database.bak.sql
    ```
4. Import prepared database dump by placing it inside the `databases` directory. [MariaDB](https://hub.docker.com/_/mariadb/) will import them on startup.
5. Create wp-config
    - name the database the same as production database, change it in `docker-compose.yml`
    - use `example` in other fields
