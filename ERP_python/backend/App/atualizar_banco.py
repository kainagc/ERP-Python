from Database import engine
from sqlalchemy import text

def ajustar_banco():
    with engine.connect() as conexao:
        # Adiciona todas as colunas que o modelo espera se ainda não existirem
        conexao.execute(text("""
            ALTER TABLE clientes ADD COLUMN IF NOT EXISTS nome VARCHAR(100);
            ALTER TABLE clientes ADD COLUMN IF NOT EXISTS cpf VARCHAR(14);
            ALTER TABLE clientes ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);
            ALTER TABLE clientes ADD COLUMN IF NOT EXISTS email VARCHAR(100);
            ALTER TABLE clientes ADD COLUMN IF NOT EXISTS endereco VARCHAR(200);
        """))
        conexao.commit()
        print("Tabela 'clientes' ajustada com sucesso!")

if __name__ == "__main__":
    ajustar_banco()