<%@ WebService Language="C#" Class="WebServiceSedeco" %>

using System;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Text;
using System.Collections.Generic;
using System.Data;

[WebService(Namespace = "http://www.regionescompetitivas.com/", Description = "Webservice dedicado para el Cliente SEDECO BC")]
public class WebServiceSedeco : WebService 
{

    [WebMethod(Description = "Consultar los Indicadores de la Pagina Principal")]
    public string ConsultaIndicadoresPrincipales() 
	{
        string cadena = "";

        using (SqlConnection connection = new SqlConnection("Server=74.208.64.218;Database=SEDECO;User Id=codechadmin;Password=codechadmin1234;"))
        using (SqlCommand cmd = new SqlCommand("EXECUTE SEDECO_Indicadores_Principales_Mobile", connection))
        {
            connection.Open();
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                // Check is the reader has any rows at all before starting to read.
                if (reader.HasRows)
                {
                    // Read advances to the next row.
                    while (reader.Read())
                    {
                        cadena = reader.GetString(reader.GetOrdinal("Cadena"));
                    }
                }
            }
        }

        return cadena;
    }

    [WebMethod]
    public DataTable FillGrid()
    {
        int[,] matrix = new int[8, 15];
        
        SqlConnection connection = new SqlConnection("Server=74.208.64.218;Database=SEDECO;User Id=codechadmin;Password=codechadmin1234;");
        
        string query = "SELECT * FROM SEDECO_Indicadores";
        DataTable dt = new DataTable("Indicadores");
        SqlDataAdapter da = new SqlDataAdapter(query, connection);

        da.Fill(dt);
        return dt;
    }
}

[Serializable]
public class User
{
	private int _id = -1;
	private string _username = "";
	private string _password = "";
	private DateTime _expirationdate = DateTime.MinValue;
	public User() { }
	public User(int id, string username, string password, DateTime expirationdate)
	{
		this.Id = id;
		this.Username = username;
		this.Password = password;
		this.ExpirationDate = expirationdate;
	}
	public int Id
	{
		get { return _id; }
		set { _id = value; }
	}
	public string Username
	{
		get { return _username; }
		set { _username = value; }
	}
	public string Password
	{
		get { return _password; }
		set { _password = value; }
	}
	public DateTime ExpirationDate
	{
		get { return _expirationdate; }
		set { _expirationdate = value; }
	}
}
[Serializable]
public class UserList : System.Collections.CollectionBase
{
	public UserList() { }
	public int Add(User value)
	{
		return base.List.Add(value as object);
	}
	public User this[int index]
	{
		get { return (base.List[index] as User); }
	}
	public void Remove(User value)
	{
		base.List.Remove(value as object);
	}
}

[Serializable]
public class Car
{
	private int _id = -1;
	private string _label = "";
	public Car() { }
	public Car(int id, string label)
	{
		this.Id = id;
		this.Label = label;
	}
	public int Id
	{
		get { return _id; }
		set { _id = value; }
	}
	public string Label
	{
		get { return _label; }
		set { _label = value; }
	}
}

